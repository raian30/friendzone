<script>
    import axios from 'axios'
    import {onMount} from "svelte";

    let email
    let username
    let password
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

    const Register = async () => {
        if (email) {
            if (username) {
                if (password) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                        let users
                        let count = 0
                        users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())
                        for (let i=0; i < users.length; i++){
                            let emailprob = users[i].email
                            let usernameprob = users[i].username

                            if (usernameprob === username || emailprob === email){
                                count++
                            }
                        }
                        if (count === 0 ){
                            if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)){
                                let id
                                await axios.post('https://63862115beaa64582673fb91.mockapi.io/api/users', {
                                    email,
                                    username,
                                    password,
                                    followers: 0,
                                    likes: 0,
                                    profilepicture: "https://static.thenounproject.com/png/3762957-200.png"
                                })
                                    .then((res) => id = res.data.id)
                                    .catch((err) => console.log(err))


                                const date = new Date()
                                let today = date.getTime()
                                let expires = 2*24*60*60*1000

                                date.setTime(today + expires)
                                let new_date = date.toUTCString()

                                document.cookie = `id=${id}; expires=${new_date}`


                                message = 'Uspjesno ste se registrirali!'
                                email = ''
                                username = ''
                                password = ''

                                location.href = '/'

                            } else {
                                message = "Molimo unesite jacu lozinku."
                            }
                        } else {
                            message = "Taj email ili username se vec koristi"
                        }
                    } else {
                        message = "Email adresa nije ispravna"
                    }

                } else {
                    message = "Morate napisati lozinku"
                }
            } else {
                message = "Morate unjeti username"
            }
        } else {
            message = "Morate unjeti email"
        }
    }
</script>

<main>
    <a href="/">Home</a>
    <a href="/login">Login</a>
    <div class="register">
        <h1>Register</h1>
        <form on:submit|preventDefault={Register}>
            <div class="input-group">
                <input type="text" bind:value = {email} placeholder="Unesite Email">
                <input type="text" bind:value = {username} placeholder="Unesite Username">
                <input type="password" bind:value = {password} placeholder="Napisite lozinku">
                <button type="submit">Registriraj se</button>
                {#if message}
                    <h2>{message}</h2>
                {/if}
            </div>
        </form>
    </div>
</main>