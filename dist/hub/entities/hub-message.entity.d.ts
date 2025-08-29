import { TypeEntity } from '../../types/entity/Type';
import { UserEntity } from '../../users/entity/User';
export declare class HubMessage {
    id: number;
    content: string;
    badword: boolean;
    sender: UserEntity;
    timestamp: Date;
    type: TypeEntity;
}
