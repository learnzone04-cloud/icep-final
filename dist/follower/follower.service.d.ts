import { Follower } from './entities/follower.entity';
import { Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
export declare class FollowerService {
    private repo;
    private studentService;
    private teacherService;
    constructor(repo: Repository<Follower>, studentService: StudentService, teacherService: TeacherService);
    create(id: number, teacherId: number): Promise<Follower>;
    find(): Promise<Follower[]>;
    findByUserType(user: any): Promise<Follower[]>;
    findFollowersForTeacher(user: any, teacherId: number): Promise<Follower[]>;
    findMyFollowers(user: any): Promise<Follower[]>;
    findById(id: number): Promise<Follower>;
    delete(id: number): Promise<Follower>;
    unfollowTeacher(user: any, teacherId: number): Promise<Follower>;
    removeFollower(user: any, studentId: number): Promise<Follower>;
    getFollowerUserIdsForTeacher(teacherId: number): Promise<number[]>;
    toggleFollow(userId: number, teacherId: number): Promise<{
        message: string;
        isFollowing: boolean;
        action: string;
    }>;
}
