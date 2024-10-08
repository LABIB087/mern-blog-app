import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux' 
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice';
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [fromData, setFromData] = useState({});
  
  const {loading: isLoading , error} = useSelector(state => state.user)

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFromData({ ...fromData, [e.target.id]: e.target.value.trim() });
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!fromData.email || !fromData.password) {
      return dispatch(signInFailure("Please fill out all the fields"));
    }
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fromData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="sm:text-xl font-bold text-4xl dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              ANI
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5 mb-5">
            Join ANIBLOG for anime reviews, recommendations and more. You can
            sign in with your email and password or with Google
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              outline
              pill
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
