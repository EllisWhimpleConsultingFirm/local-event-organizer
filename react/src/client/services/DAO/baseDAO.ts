import {getClient} from "../Client";

export class BaseDAO {

    async getOptionsFromClient(tableName: string): Promise<any> {
        const {data, error} = await getClient()
            .from('Events')
            .select()
        if (error) {
            throw error;
        }
        if (data) {
            return data
        }
    }
}