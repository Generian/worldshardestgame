import { NextRouter } from "next/router"

export const navigateToHome = async (router: NextRouter) => {
    router.push('/')
}