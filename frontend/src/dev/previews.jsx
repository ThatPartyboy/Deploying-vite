import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Cal from "../App";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Cal">
                <Cal/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
