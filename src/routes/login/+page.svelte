<script>
    import {onMount} from "svelte";

    let username
    let password
    let user
    let message

    onMount(async () => {
        let cookies = document.cookie
        cookies = cookies.split(';')
        let id = cookies[0]
        id = id.split('=')
        id = id[1]
        let users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())
        for (let i = 0; i<users.length; i++) {
            let usertest = users[i]
            if (usertest.id === id) {
                location.href = `/`;
            }
        }
    });

    const Login = async () => {
        if (username){
            if (password){
                let users
                users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())

                for (let i=0; i < users.length; i++){
                    let usernameprob = users[i].username
                    let passwordprob = users[i].password

                    if (usernameprob === username && passwordprob === password){
                        user = users[i]

                        message = 'Uspjesno ste se logirali!'
                        username = ''
                        password = ''


                        const date = new Date()
                        let today = date.getTime()
                        let expires = 2*24*60*60*1000

                        date.setTime(today + expires)
                        let new_date = date.toUTCString()

                        document.cookie = `id=${user.id}; expires=${new_date}`

                        location.href = '/'
                    }
                }
                if (!user) {
                    message = "Kriv username ili lozinka"
                }

            } else {
                message = "Morate napisati lozinku"
            }
        } else{
            message = "Morate unjeti username"
        }
    }
</script>

<main>
    <a href="/">Home</a>
    <a href="/register">Register</a>
    <div class="login">
        <h1>Login</h1>
        <form on:submit|preventDefault={Login}>
            <div class="input-group">
                <input type="text" bind:value = {username} placeholder="Unesite Username">
                <input type="password" bind:value = {password} placeholder="Unesite lozinku">
                <button type="submit">Logiraj se</button>
                {#if message}
                    <h2>{message}</h2>
                {/if}
            </div>
        </form>
    </div>
</main>