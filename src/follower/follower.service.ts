import { Injectable } from '@nestjs/common';
import { Follower } from './entities/follower.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(Follower) private repo: Repository<Follower>,
    private studentService: StudentService,
    private teacherService: TeacherService,
  ) {}

  async create(id: number, teacherId: number) {
    const student = await this.studentService.findOneByUserId(id);
    const teacher = await this.teacherService.findOneById(teacherId);
    const follower = this.repo.create();

    follower.student = student;
    follower.teacher = teacher;

    return this.repo.save(follower);
  }

  find() {
    return this.repo.find();
  }

  async findByUserType(user: any) {
    console.log('User from JWT:', user);
    console.log('User role:', user.role);
    console.log('User typeId:', user.typeId);
    
    // If user is a student, show teachers with matching type
    if (user.role === 'Student' && user.typeId) {
      console.log('Filtering followers for student with typeId:', user.typeId);
      const followers = await this.repo.find({
        where: { studentId: user.id },
        relations: [
          'teacher',
          'teacher.type',
          'student',
        ],
      });
      
      // Filter to only show teachers with matching type
      const filteredFollowers = followers.filter(follower => 
        follower.teacher?.type?.id === user.typeId
      );
      
      console.log('Found followers for student:', filteredFollowers.map(f => ({ 
        id: f.id, 
        teacherId: f.teacherId, 
        teacherType: f.teacher?.type?.name 
      })));
      return filteredFollowers;
    }
    
    // If user is a teacher, return empty array (teachers don't see followers)
    if (user.role === 'Teacher') {
      console.log('Teacher requested followers - returning empty array');
      return [];
    }
    
    // If no valid role or other cases, return empty array
    console.log('No valid role found, returning empty array');
    return [];
  }

  async findFollowersForTeacher(user: any, teacherId: number) {
    console.log('User from JWT:', user);
    console.log('Requested teacherId:', teacherId);
    
    // Only teachers can see their followers
    if (user.role !== 'Teacher') {
      console.log('Non-teacher user requested followers - returning empty array');
      return [];
    }
    
    // Check if the teacher is requesting their own followers
    const teacher = await this.teacherService.findOneByUser(user.id);
    if (!teacher || teacher.id !== teacherId) {
      console.log('Teacher trying to access other teacher followers - returning empty array');
      return [];
    }
    
    console.log('Teacher accessing their own followers');
    const followers = await this.repo.find({
      where: { teacherId: teacherId },
      relations: [
        'student',
        'student.user',
      ],
    });
    
    console.log('Found followers for teacher:', followers.map(f => ({ 
      id: f.id, 
      studentId: f.studentId,
      studentName: `${f.student?.user?.fName} ${f.student?.user?.lName}`
    })));
    return followers;
  }

  async findMyFollowers(user: any) {
    console.log('User from JWT:', user);
    
    // Only teachers can see their followers
    if (user.role !== 'Teacher') {
      console.log('Non-teacher user requested followers - returning empty array');
      return [];
    }
    
    // Get the teacher record for this user
    const teacher = await this.teacherService.findOneByUser(user.id);
    if (!teacher) {
      console.log('Teacher record not found - returning empty array');
      return [];
    }
    
    console.log('Teacher accessing their own followers, teacherId:', teacher.id);
    const followers = await this.repo.find({
      where: { teacherId: teacher.id },
      relations: [
        'student',
        'student.user',
      ],
    });
    
    console.log('Found followers for teacher:', followers.map(f => ({ 
      id: f.id, 
      studentId: f.studentId,
      studentName: `${f.student?.user?.fName} ${f.student?.user?.lName}`
    })));
    return followers;
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    const follow = await this.findById(id);
    if (!follow) throw new Error('Follow does not found');

    return this.repo.remove(follow);
  }

  async unfollowTeacher(user: any, teacherId: number) {
    console.log('User unfollowing teacher:', user.id, 'teacherId:', teacherId);
    console.log('User ID type:', typeof user.id, 'Teacher ID type:', typeof teacherId);
    
    // Only students can unfollow teachers
    if (user.role !== 'Student') {
      throw new Error('Only students can unfollow teachers');
    }
    
    // Get the student record for this user
    const student = await this.studentService.findOneByUserId(user.id);
    if (!student) {
      throw new Error('Student record not found');
    }
    
    console.log('Found student record:', student.id);
    
    // First, let's see all follow relationships for this student
    const allFollows = await this.repo.find({
      where: { studentId: student.id }
    });
    console.log('All follows for this student:', allFollows);
    
    // Find the follow relationship
    const follow = await this.repo.findOne({
      where: { 
        studentId: student.id,
        teacherId: teacherId 
      }
    });
    
    console.log('Found follow relationship:', follow);
    
    if (!follow) {
      throw new Error('Follow relationship not found');
    }
    
    console.log('Removing follow relationship:', follow.id);
    return this.repo.remove(follow);
  }

  async removeFollower(user: any, studentId: number) {
    console.log('Teacher removing follower:', user.id, 'studentId:', studentId);
    
    // Only teachers can remove followers
    if (user.role !== 'Teacher') {
      throw new Error('Only teachers can remove followers');
    }
    
    // Get the teacher record for this user
    const teacher = await this.teacherService.findOneByUser(user.id);
    if (!teacher) {
      throw new Error('Teacher record not found');
    }
    
    // Find the follow relationship
    const follow = await this.repo.findOne({
      where: { 
        teacherId: teacher.id,
        studentId: studentId 
      }
    });
    
    if (!follow) {
      throw new Error('Follow relationship not found');
    }
    
    console.log('Removing follow relationship:', follow.id);
    return this.repo.remove(follow);
  }

  // Get all follower student userIds for a teacher
  async getFollowerUserIdsForTeacher(teacherId: number): Promise<number[]> {
    const followers = await this.repo.find({
      where: { teacherId },
      relations: ['student', 'student.user'],
    });
    // Return the userId of each student
    return followers
      .map(f => f.student?.user?.id)
      .filter(id => typeof id === 'number');
  }

  async toggleFollow(userId: number, teacherId: number) {
    console.log('Toggling follow for user:', userId, 'teacherId:', teacherId);
    
    // Get the student record for this user
    const student = await this.studentService.findOneByUserId(userId);
    if (!student) {
      throw new Error('Student record not found');
    }
    
    console.log('Found student record:', student.id);
    
    // Check if already following
    const existingFollow = await this.repo.findOne({
      where: { 
        studentId: student.id,
        teacherId: teacherId 
      }
    });
    
    if (existingFollow) {
      // Already following, so unfollow
      console.log('Student already following, removing follow relationship');
      await this.repo.remove(existingFollow);
      return { 
        message: 'Unfollowed successfully',
        isFollowing: false,
        action: 'unfollowed'
      };
    } else {
      // Not following, so follow
      console.log('Student not following, creating follow relationship');
      const teacher = await this.teacherService.findOneById(teacherId);
      if (!teacher) {
        throw new Error('Teacher not found');
      }
      
      const newFollow = this.repo.create({
        studentId: student.id,
        teacherId: teacherId
      });
      
      await this.repo.save(newFollow);
      return { 
        message: 'Followed successfully',
        isFollowing: true,
        action: 'followed'
      };
    }
  }
}
