export let routes = {
    posts: {
        create_post: "/",
        get_posts: "/",
        get_post: "/:postId",
        get_similar: "/post/similar",
        search: "/post/search",
        update: "/",
        remove: "/:postId/:thumbnail"
    },
    users: {
        authenticate: "/login",
        create_user: "/",
        update: "/"
    }
}