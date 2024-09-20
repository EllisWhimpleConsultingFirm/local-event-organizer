import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <form className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
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
                    formAction={login}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Log in
                </button>
                <button
                    type="submit"
                    formAction={signup}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign up
                </button>
            </div>
        </form>

    )
}