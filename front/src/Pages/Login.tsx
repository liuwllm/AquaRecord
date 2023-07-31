import LoginForm from "../Components/LoginForm";

const LoginPage = () => {
    return (
        <>
        <h1>Login</h1>
        <LoginForm/>
        <div>
                Don't have an account?  
                <a href="/register"> Register now!</a>
        </div>
        </>
    )
}

export default LoginPage;