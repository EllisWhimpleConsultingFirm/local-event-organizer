interface User {
    id: string;
    username: string;
    password: string; // In a real app, this should be a hashed password
    isAdmin: boolean;
}

class UserStore {
    private users: User[] = [
        { id: '1', username: 'admin', password: 'adminpass', isAdmin: true },
        { id: '2', username: 'user', password: 'userpass', isAdmin: false },
    ];

    async findUser(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    async validateCredentials(username: string, password: string): Promise<User | null> {
        const user = await this.findUser(username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    async getUserById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }
}

export const userStore = new UserStore();