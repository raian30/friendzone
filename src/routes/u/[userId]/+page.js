export const load = async ({fetch, params}) => {
    let user
    const users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())

    for (let i=0; i < users.length; i++){
        let usernameprob = users[i].username

        if (usernameprob === params.userId){
            user = users[i]
        }
    }

    const fetchUsers = async () => {
        const res = await fetch(`https://63862115beaa64582673fb91.mockapi.io/api/users/${user.id}`)
        const data = await res.json()
        return data
    }
    return {
        user: fetchUsers(params.userId)
    }
}