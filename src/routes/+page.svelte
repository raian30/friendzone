<script>

    import {onMount} from "svelte";
    import axios, {all} from "axios";

    let posts
    let commentsOnPost = []
    let user
    let message
    let searchuser
    let description
    let pogledaj = false

    onMount(async () => {
        GetCookies()
        getPosts()
    });


    const GetCookies = async () => {
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
    }

    const Search = async () => {
        let found = false
        let users
        users = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/users').then(x => x.json())

        for (let i=0; i < users.length; i++){
            let usernameprob = users[i].username

            if (usernameprob === searchuser){
                window.location.href = window.location.href+`u/${searchuser}`
                message = ''
                found = true
            }
        }
        if (!found){
            message = 'Taj user ne postoji'
        }

    }

    const SeeComment = async (post) => {
        let img = post
        let allimgs = document.querySelectorAll('.posts img')
        let result

        allimgs.forEach(findUsername)

        function findUsername (pimg){
            if (pimg.src === img){
                result = pimg
            }
        }

        let div = result.closest('div')
        let btns = div.querySelectorAll('button')
        let btn = btns[2]
        let form = div.querySelector('form')
        let allforms = document.querySelectorAll('.posts form')
        let allbtns = document.querySelectorAll('.posts .seeComment')

        if (form.style.display === 'none'){
            for(let i = 0; i<allforms.length; i++) {
                allforms[i].style.display = 'none'
                allbtns[i].innerText = 'Komentiraj'
            }
            btn.innerText = 'Odustani'
            form.style.display = 'block'
        } else {
            btn.innerText = 'Komentiraj'
            form.style.display = 'none'
        }
    }

    const AddComment = async (post) => {
        if (description){
            await axios.post('https://63862115beaa64582673fb91.mockapi.io/api/comments', {
                userid: user.id,
                postid: post.id,
                description: `${user.username}: ${description}`,
            })
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err))
            location.href = `/`;
        }
    }

    const SeeComments = async (post, imgurl) => {
        let img = imgurl
        let allimgs = document.querySelectorAll('.posts img')
        let result

        allimgs.forEach(findUsername)

        function findUsername (pimg){
            if (pimg.src === img){
                result = pimg
            }
        }

        let div = result.closest('div')
        let btns = div.querySelectorAll('button')
        let paragraph = div.querySelector('.descrpition')
        let btn = btns[1]


        if (paragraph.innerText === ''){
            let postComments = []
            btn.innerText = 'Sakrij Komentare'
            let comments = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/comments').then(x => x.json())
            for(let i = 0; i<comments.length; i++) {
                let comment = comments[i]
                if (post.id === comment.postid) {
                    postComments.push(comment)
                }
            }
            commentsOnPost = postComments
            if (commentsOnPost.length > 0){
                for(let i = 0; i<commentsOnPost.length; i++){
                    paragraph.innerText += commentsOnPost[i].description
                    paragraph.innerHTML += '<br>'
                }
            } else {
                paragraph.innerText = 'Nema Komentara'
            }


        } else {
            commentsOnPost = []
            paragraph.innerText = ''
            console.log(commentsOnPost)
            btn.innerText = 'Pogledaj Komentare'
        }
    }

    const getPosts = async () => {
        posts = await fetch('https://63862115beaa64582673fb91.mockapi.io/api/posts').then(x => x.json())
    }

</script>

<main>
    {#if !user}
        <a href="/register">Register</a>
        <a href="/login">Login</a>
    {/if}
    <h1>Pozdrav {#if user} {user.username}. {/if}</h1>
    <form on:submit|preventDefault={Search}>
        <div class="input-group">
            <input type="text" bind:value = {searchuser} placeholder="Pretrazi usera">
            <button type="submit">Pretrazi</button>
            {#if message}
                <h2>{message}</h2>
            {/if}
        </div>
    </form>
    {#if user}
        <a href='/u/{user.username}'>Pogledaj svoj profil</a>
    {/if}
    <h1>Najnovije Objave</h1>
    {#if posts}
        <div class="posts">
            {#each posts as post}
                <div>
                    <h1>{post.username}</h1>
                    <img src="{post.imgurl}" alt="post picture" height="500px">
                    <p>{post.description}
                    <form on:submit|preventDefault={AddComment(post)} style="display: none">
                        <div class="input-group">
                            <input type="text" bind:value = {description} placeholder="Komentar">
                            <button type="submit">Komentiraj</button>
                        </div>
                    </form>
                    <p class="descrpition"></p>
                    <button on:click={SeeComments(post, post.imgurl)}>Pogledaj Komentare</button>
                    {#if user}
                        <button on:click={SeeComment(post.imgurl)} class="seeComment">Komentiraj</button>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</main>