import {useMemo} from "react";
import {getClient} from "../services/Client";

function useClient() {
    return useMemo(getClient, []);
}

export default useClient;