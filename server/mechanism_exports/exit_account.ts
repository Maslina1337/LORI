function exit_account(page_session: any) {
    page_session.authorization = null;
}

export { exit_account };