import * as React from 'react';

export default (props: any) => {
    if (props.ids.length === 0) { return null; }

    return (
        <div>
            <strong>Las siguientes series no existen: </strong><span>{props.ids.join(', ')}</span>
        </div>
    )
}