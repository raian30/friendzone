<script>
    import {onMount} from "svelte";
    import axios from "axios";

    export let data
    const { user } = data
    let id
    let myacc
    let myposts = []
    let mycomments = []

    let iusername
    let ipassword
    let iemail
    let iprofilepicture

    let iurl
    let idescription

    onMount(async () => {
        await GetCookies()
        myposts = await GetMyPosts()
        mycomments = await GetMyComments()
    });

    const GetCookies = async () => {
        let cookies = document.cookie
        cookies = cookies.split(';')
        id = cookies[0]
        id = id.split('=')
        id = id[1]
        let users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())
        for (let i = 0; i<users.length; i++) {
            let usertest = users[i]
            if (usertest.id === id) {
                id = usertest.id
            }
        }
        if(user.id === id) {
            myacc = true
        }
    }
    const GetMyPosts = async () => {
        let myPosts = []
        let posts = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/posts').then(x => x.json())
        posts.forEach((post) => {
            if (post.userid === user.id) {
                myPosts.push(post)
            }
        });
        return myPosts
    }

    const GetMyComments = async () => {
        let myComments = []
        let comments = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/comments').then(x => x.json())
        comments.forEach((comment) => {
            if (comment.userid === user.id) {
                myComments.push(comment)
            }
        });
        return myComments
    }

    const Logout = async () => {
        const date = new Date()
        let today = date.getTime()
        let expires = 365*24*60*60*1000

        date.setTime(today - expires)
        let new_date = date.toUTCString()

        document.cookie = `id=${user.id}; expires=${new_date}`

        setTimeout(() => {location.href = '/'}, 2000);
    }

    const DeleteAccount = async () => {
        await axios.delete(`https://63862115beaa64582673fb91.mockapi.io/api/users/${user.id}`, {})
        for(let i = 0; i<myposts.length; i++){
            await axios.delete(`https://63862115beaa64582673fb91.mockapi.io/api/posts/${myposts[i].id}`, {})
        }
        for(let i = 0; i<mycomments.length; i++){
            await axios.delete(`https://63862115beaa64582673fb91.mockapi.io/api/comments/${mycomments[i].id}`, {})
        }
        Logout()
        location.href = '/'
    }

    const EditProfile = async () => {
        axios.put(`https://63862115beaa64582673fb91.mockapi.io/api/users/${user.id}`, {
            username: iusername,
            email: iemail,
            password: ipassword,
            profilepicture: iprofilepicture
        })
            .then((res) => location.href = `/u/${res.data.username}`)
            .catch((err) => console.log(err))

        for(let i = 0; i<myposts.length; i++){
            console.log(myposts[i].username)
            await axios.put(`https://63862115beaa64582673fb91.mockapi.io/api/posts/${myposts[i].id}`,{
                username: iusername
            })
        }

        iusername = ''
        iemail = ''
        ipassword = ''
        iprofilepicture = ''
    }

    const showEditProfile = () => {
        let btns = document.querySelectorAll('button')
        let btn = btns[3]
        let forms = document.querySelectorAll('form')
        let form = forms[0]

        if (form.style.display === 'none'){
            btn.innerText = 'Odustani'
            form.style.display = 'block'
        } else {
            btn.innerText = 'Uredi Profil'
            form.style.display = 'none'
        }
    }

    const DeletePost = async (post) => {
        await axios.delete(`https://63862115beaa64582673fb91.mockapi.io/api/posts/${post.id}`, {})
        let comments = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/comments').then(x => x.json())
        for(let i = 0; i<comments.length; i++) {
            if(post.id === comments[i].postid) {
                await axios.delete(`https://63862115beaa64582673fb91.mockapi.io/api/comments/${comments[i].id}`, {})
            }
        }
        location.href = `/u/${post.username}`
    }

    const ShowEditPost = async () => {
        let btns = document.querySelectorAll('button')
        let btn = btns[5]
        let forms = document.querySelectorAll('form')
        let form = forms[1]

        if (form.style.display === 'none'){
            btn.innerText = 'Odustani'
            form.style.display = 'block'
        } else {
            btn.innerText = 'Uredi Objavu'
            form.style.display = 'none'
        }
    }

    const EditPost = async (post) => {
        axios.put(`https://63862115beaa64582673fb91.mockapi.io/api/posts/${post.id}`, {
            imgurl: iurl,
            description: idescription,
        })
            .then((res) => location.href = `/u/${res.data.username}`)
            .catch((err) => console.log(err))

        iurl = ''
        idescription = ''
    }

</script>

<main>
    <a href="/">Home</a>
    <div>
        <img src={user.profilepicture} alt="profile picture" height="100px">
        <h1>Username: {user.username}</h1>
        <p>Followers: {user.followers}</p>
        <p>Likes: {user.likes}</p>
    </div>
    <form on:submit|preventDefault={EditProfile} style="display: none">
        <div class="input-group">
            <input type="text" bind:value = {iusername} placeholder="Username">
            <input type="text" bind:value = {ipassword} placeholder="Password">
            <input type="text" bind:value = {iemail} placeholder="Email">
            <input type="text" bind:value = {iprofilepicture} placeholder="Slika Profila">
            <button type="submit">Izmjeni</button>
        </div>
    </form>
    {#if myacc}
        <button on:click={DeleteAccount}>Izbrisi Profil</button>
        <button on:click={Logout}>Odjava</button>
        <button on:click={showEditProfile}>Uredi Profil</button>
        <a href="/add">Dodaj novu objavu</a>
    {/if}
    {#if myposts}
        {#each myposts as mypost}
            <h1>{mypost.username}</h1>
            <img src="{mypost.imgurl}" alt="post picture" height="500px">
            <p>{mypost.description}
            <form on:submit|preventDefault={EditPost(mypost)} style="display: none">
                <div class="input-group">
                    <input type="text" bind:value = {iurl} placeholder="URL Slike">
                    <input type="text" bind:value = {idescription} placeholder="Opis Objave">
                    <button type="submit">Izmjeni</button>
                </div>
            </form>
            {#if myacc}
                <button on:click={ShowEditPost}>Uredi Objavu</button>
                <button on:click={DeletePost(mypost)}>Izbrisi Objavu</button>
            {/if}
        {/each}
    {/if}
</main>
