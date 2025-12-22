import { ChatListItem } from "../../../../domain/entities/projections/ChatListItem";
import { GetChatsInputDTO } from "../../../dtos/ChatDTO";


export interface IGetUserChatsUseCase{
    execute(input: GetChatsInputDTO): Promise<ChatListItem[]> 
}