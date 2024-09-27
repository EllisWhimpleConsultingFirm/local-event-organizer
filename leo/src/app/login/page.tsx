'use client';

import { CredentialResponse } from "google-one-tap";
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleSignInWithGoogle = async (response: CredentialResponse) => {
        try {
            console.log('Google Credential Response:', response);

            router.push('/dashboard');
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <Script src="https://accounts.google.com/gsi/client" async defer />

            <div id="g_id_onload"
                 data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback={(response: CredentialResponse) => handleSignInWithGoogle(response)}
                 data-nonce=""
                 data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                 data-type="standard"
                 data-shape="pill"
                 data-theme="filled_blue"
                 data-text="signin_with"
                 data-size="large"
                 data-logo_alignment="left">
            </div>

            <form className="mt-6">
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Log in
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}
