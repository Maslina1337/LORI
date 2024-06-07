import { createRef, useEffect, useRef, useState } from "react";
import "./live_logotype.css";
import ReactDOM from 'react-dom';

export default function LiveLogotype(props) {
    const original_text = props.text;

    let original_text_letters = original_text.split('');

    const live_logotype_ref = useRef();
    const letters_ref = useRef(original_text_letters.map(() => createRef()));

    const [letterComputedWidthes, setLetterComputedWidthes] = useState([]);

    const [remixInterval, setRemixInterval] = useState();

    // Сопоставление индексов изначального расположения букв и перемешанного. 
    const [currentLetterComparison, setCurrentLetterComparison] = useState([0]);

    function remix_letters() {
            let currentLetterComparison_copy = currentLetterComparison;
            
            shuffle_array(currentLetterComparison_copy);
            apply_offsets_to_letters(currentLetterComparison_copy, letterComputedWidthes);
            setCurrentLetterComparison(currentLetterComparison_copy);
    }

    function shuffle_array(array) {
        let currentIndex = array.length;
      
        while (currentIndex != 0) {
      
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      }

    useEffect(() => {
        let letter_comparison = [];

        // Дефолтное сопоставление.
        original_text_letters.forEach((element, index) => {
            letter_comparison.push(index);
        })

        setCurrentLetterComparison(letter_comparison);

        let letter_computed_widthes = [];

        original_text_letters.map((element, index) => {
            letter_computed_widthes.push(parseFloat(getComputedStyle(letters_ref.current[index].current).width));
        });
        setLetterComputedWidthes(letter_computed_widthes);

        let logotype_width = 0;

        letter_computed_widthes.map((element) => {
            logotype_width += element;
        })

        live_logotype_ref.current.style.maxWidth = logotype_width + "px";
        live_logotype_ref.current.style.minWidth = logotype_width + "px";

        apply_offsets_to_letters(letter_comparison, letter_computed_widthes);
    }, [])

    function apply_offsets_to_letters(letter_comparison, letter_computed_widthes) {
        letters_ref.current.forEach((element, index) => {
            let current_offset = 0;
            for (let i = 0; index > i; i++) {
                current_offset += letter_computed_widthes[letter_comparison[i]];
            }
            letters_ref.current[letter_comparison[index]].current.style.left = current_offset + "px";
        })
    }

    return (
        <>
            <div ref={live_logotype_ref} className="live_logotype" onClick={remix_letters}>
                {
                    original_text_letters.map((element, index) => (
                        <h1 ref={letters_ref.current[index]} key={index}>
                            {element}
                        </h1>
                    ))
                }
            </div>
        </>
    )
}