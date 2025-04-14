interface IPublication {
    title: string;
    description: string;
    link: string;
}

const PublicationCard = (props: IPublication) => {
  return (
    <div className="bg-white dark:bg-gray-500 rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{props.title}</h2>
      <p className="text-gray-700 mb-4">{props.description}</p>
      <a href={props.link} className="text-blue-500 hover:underline">
        {props.link}
      </a>
    </div>
  )
}

export {PublicationCard, type IPublication}