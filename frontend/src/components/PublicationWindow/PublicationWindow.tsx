import PublicationCard from "../PublicationCard/PublicationCard";

const PublicationWindow = (props) => {
    const data = props.publications;

  return (
    <div>
        <div className="mt-4 flex flex-col justify-center">
            {/* Add your publication cards here */}
            {data.map((publication, index) => (
                <PublicationCard
                    key={index}
                    title={publication.title}
                    description={publication.description}
                    link={publication.link}
                />
            ))}
        </div>
    </div>
  )
}

export default PublicationWindow