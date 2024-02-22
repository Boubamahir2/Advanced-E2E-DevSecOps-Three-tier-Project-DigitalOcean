import { useState, useEffect } from "react";
import { FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
// style toasts or alerts library
import { toast } from "react-toastify";
import { registerUser, loginUser } from "../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  // age: "",
  isMember: true,
};

function Register() {
  const [values, setValue] = useState(initialState);
  const { isLoading, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    //we want to check the name only if the isMember is true
    if (!email || !password || (!isMember && !name)) {
      toast.error("Please fill all the fields");
      return;
    }
    if (isMember) {
      dispatch(loginUser({ email: email, password: password }));
      return;
    }
    dispatch(registerUser({ name: name, email: email, password: password }));
  };

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    //seting values with dynamic object keys
    // console.log(`${name} : ${value}`);
    setValue({ ...values, [name]: value });
  };

  //toggle isMember
  const toggleMember = () => {
    //here we are using the spread operator to copy the values of the object
    //and then we are changing the value of isMember to the opposite of what it is currently then like it will toggle between true and false
    //this is a shallow copy
    setValue({ ...values, isMember: !values.isMember });
  };

  //useEffect to check if the user is already logged in
  //if the user is already logged in then we want to redirect to the home page

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        {/* <Logo /> */}
        <Logo />
        {/* here want to check the value is already a member then go with login or else Register */}
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {/* name field */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email fields */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* birthdate
        {!values.isMember && (
          <FormRow
            type="number"
            name="age"
            min="18"
            value={values.date}
            handleChange={handleChange}
            labelText="Age"
          />
        )} */}
        {/* pasword fields */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {isLoading ? "Loading..." : values.isMember ? "Login" : "Register"}
        </button>

        {/* testing demo */}
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() =>
            dispatch(
              loginUser({ email: "testUser@test.com", password: "secret" })
            )
          }
        >
          {isLoading ? "loading..." : "demo app"}
        </button>

        {/* toggle isMember */}
        <p>
          {values.isMember
            ? "Don't have an account?"
            : "Already have an account?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
