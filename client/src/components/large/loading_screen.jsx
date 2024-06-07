import "./loading_screen.css"

export default function LoadingScreen(props) {
    const title = props.title;
    const description = props.description;
    const gif = props.gif;

    return (
        <>
            <div className="screen_size_box">
                <div className="loading_screen">
                    <div className="loading_gif_string">
                        {(gif ? 
                            <img className="gif" src={gif}/>
                        : "")}
                    </div>

                    {(title ? 
                        <h1 className="title">{title}</h1>
                    : "")}

                    {(description ? 
                        <p className="description">{description}</p>
                    : "")}
                </div>
            </div>
        </>
    );
}