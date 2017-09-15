/**
 * error messages and their codes
 */
export const errors = {
    title: 'Title should be a string of 1 to 50 characters',
    body: 'The post body is required',
    thumbnail: 'The post thumbnail is required',
    images: 'Invalid image path format',
    tags: 'Invalid tags',
    last: 'Invalid date format. Only ISO date format is allowed',
    postId: 'Missing or invalid post id',
    query: 'Search query is required',
    body_not_required: 'Post body cannot be empty',
    thumbnail_not_required: 'Post thumbnail cannot be empty',
    override_tags: 'Override tags option should be boolean. False by default',
    wrong_username_or_password: 'Wrong username or password',
    not_authenticated: 'Please sign in to continue',
    username: 'Username is required',
    password: 'password is required',
    update_user_failed: 'Could not update user',
    invalid_new_username: 'New username should be between 6 and 12 characters',
    invalid_new_password: 'New password should be between 8 and 16 characters'
}
