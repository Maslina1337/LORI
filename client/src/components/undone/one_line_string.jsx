import { useEffect, useRef, useState } from "react";

export default function OneLineString(props) {
    const text = props.text;

    const [countOfTextRepeat, setCountOfTextRepeat] = useState(1);

    const text_repeat_box_ref = useRef();
    const text_ref = useRef();

    useEffect(() => {
        setCountOfTextRepeat(Math.ceil(parseFloat(getComputedStyle(text_repeat_box_ref.current).width) / parseFloat(getComputedStyle(text_ref.current).width)));
    }, []);

    return (
        <>
            <div className="text_repeat_box">
                {
                    
                }
            </div>
        </>
    )
}