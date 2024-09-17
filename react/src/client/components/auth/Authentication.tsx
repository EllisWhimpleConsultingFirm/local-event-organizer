import React, {SetStateAction, useEffect, useState} from 'react'
import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import {Session} from "@supabase/supabase-js";
import useClient from "../../hooks/useClient";

const Authentication: React.FC = () => {
    const client = useClient()
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        client.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const {data: {subscription}} = client.auth.onAuthStateChange((_event: string, session: SetStateAction<Session | null>) => {
            setSession(session)
            // need page reload when user is logging in
            if (_event == 'SIGNED_IN') {
                // window.location.reload()
            }
        })

        return () => subscription?.unsubscribe()
    }, [])

    if (!session) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-superlightgr">
                <div className="rounded-lg bg-white w-1/3 h-1/2 pt-12">
                    {/*<div className="flex align-center justify-center w-1/2 h-1/5 mx-auto">*/}
                    {/*    <img src={logoSrc}/>*/}
                    {/*</div>*/}
                    <h3 className="font-light">
                        Item Master Login
                    </h3>
                    <div className="flex align-center justify-center w-full">
                        <Auth
                            supabaseClient={client}
                            localization={{
                                variables: {
                                    sign_in: {
                                        email_label: '',
                                        password_label: '',
                                        loading_button_label: 'Signing in...'
                                    },
                                },
                            }}
                            providers={[]}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#A6947A',
                                            brandAccent: '#A6947A',
                                            defaultButtonBackgroundHover: '#A6947A'
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Authentication
