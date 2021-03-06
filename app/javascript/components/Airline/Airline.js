import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Header from "./Header";
import styled from "styled-components";
import ReviewForm from "./ReviewForm";

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const Column = styled.div`
  background: #fff;
  height: 100vh;
  overflow: scroll;

  &:last-child {
    background: #000;
  }
`;
const Main = styled.div`
  padding-left: 50px;
`;

function Airline(props) {
  const [airline, setAirline] = useState({});
  const [review, setReview] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const slug = props.match.params.slug;
    const url = `/api/v1/airlines/${slug}`;
    axios
      .get(url)
      .then((resp) => {
        setAirline(resp.data);
        setLoaded(true);
      })
      .catch((resp) => console.log(resp));
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    const airline_id = airline.data.id;
    axios
      .post("/api/v1/reviews", { review, airline_id })
      .then((resp) => {
        const included = [...airline.included, resp.data.data];
        setAirline({ ...airline, included });
        setReview({ title: "", description: "", score: 0 });
      })
      .catch((resp) => {});
  };

  const setRating = (score, e) => {
    e.preventDefault();

    setReview({ ...review, score });
  };

  return (
    <Wrapper>
      {loaded && (
        <Fragment>
          <Column>
            <Main>
              <Header
                attributes={airline.data.attributes}
                reviews={airline.included}
              />
            </Main>
            <div className="reviews"></div>
          </Column>
          <Column>
            <ReviewForm
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              attributes={airline.data.attributes}
              review={review}
              setRating={setRating}
            />
          </Column>
        </Fragment>
      )}
    </Wrapper>
  );
}

export default Airline;
