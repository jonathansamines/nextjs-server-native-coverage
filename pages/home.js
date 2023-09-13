import React from 'react';

export default function Index({ message }) {
  return (
    <span>{`Hello ${message}`}</span>
  );
}

export function getServerSideProps() {
  return {
    props: {
      message: 'world',
    },
  };
}
