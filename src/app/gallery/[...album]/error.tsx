"use client"; // Error boundaries must be Client Components

// import { useEffect, useState } from "react";

// export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
export default function Error({ error }: { error: Error & { digest?: string } }) {
  // const [ error, setError ] = useState({ error: null, status: null, message: null });

  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error("Error boundary - ", JSON.stringify(error));
  // }, [error]);

  return (
    <div>
      <h2>Oops!</h2>
      <h3>There was a problem retrieving the album, please check URL and try again.</h3>
      <br />
      <hr />
      <br />
      <p>
        <u>Error Message:</u>
      </p>
      <ul>
        <li>{error.message}</li>
      </ul>
      <br />
      {/* <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
    </div>
  );
}
