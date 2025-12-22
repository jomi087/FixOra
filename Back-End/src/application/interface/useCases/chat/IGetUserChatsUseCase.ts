import { ChatListItem } from "../../../../domain/entities/projections/ChatListItem";
import { GetChatsInputDTO } from "../../../dto/ChatDTO";


export interface IGetUserChatsUseCase{
    execute(input: GetChatsInputDTO): Promise<ChatListItem[]> 
}