export default function Page({ params }: { params: { Count: number } }) {
    return <div>My Post: {params.Count}</div>
  }