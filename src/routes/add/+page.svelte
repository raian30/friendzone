<script>
    import {onMount} from "svelte";
    import axios from "axios";

    let imgurl
    let description
    let message
    let user

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
                user = usertest
            }
        }
        if (!user) {
            location.href ='/'
        }
    });

    const AddPost = async () => {
        if (imgurl){
            if (description){
                await axios.post('https://63862115beaa64582673fb91.mockapi.io/api/posts', {
                    userid: user.id,
                    username: user.username,
                    imgurl,
                    description,
                })
                    .then((res) => console.log(res.data))
                    .catch((err) => console.log(err))
                location.href = `/u/${user.username}`;
            } else {
                message = "Morate napisati opis objave"
            }
        } else{
            message = "Morate unjeti URL slike"
        }
    }
</script>

<main>
    <div class="addpost">
        <h1>Dodaj novu objavu</h1>
        <form on:submit|preventDefault={AddPost}>
            <div class="input-group">
                <input type="text" bind:value = {imgurl} placeholder="Unesite URL slike">
                <input type="text" bind:value = {description} placeholder="Unesite opis objavi">
                <button type="submit">Dodaj</button>
                {#if message}
                    <h2>{message}</h2>
                {/if}
            </div>
        </form>
    </div>
</main>