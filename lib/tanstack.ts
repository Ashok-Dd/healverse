import {useQuery} from "@tanstack/react-query";
import {fetchApi} from "@/lib/fetchApi";
import {Conversation} from "@/types/type";


export const useConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: () => fetchApi<Conversation[]>("/api/conversations/" , {method: 'GET' , requiresAuth : true}),
    });
};