import {useMemo} from "react";

function useClient() {
    return useMemo(getClient, []);
}

export default useClient;