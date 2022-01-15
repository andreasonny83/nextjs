function Page({ data }) {
  return <div>Welcome to Next.js {data.name}!</div>;
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await fetch(`${context.req.headers.referer}api/hello`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default Page;
