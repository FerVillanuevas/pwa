export default function ConfirmationPage({ params }: { params: {reference: string} }) {
  return <div className="container justify-center">
    <p>confirmation...</p>
    <p>{params.reference}</p>
  </div>;
}
