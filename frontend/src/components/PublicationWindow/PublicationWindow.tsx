import {PublicationCard, IPublication} from "../PublicationCard/PublicationCard";

interface IProps {
    publications: IPublication[]
}

const PublicationWindow = (props: IProps) => {
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