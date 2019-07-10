import * as React from 'react';
import { IDataPoint } from '../../api/DataPoint';
import { ISerie } from '../../api/Serie';
import { CardValueFormatter } from '../../helpers/cardValueFormatter';
import { fullLocaleDate } from '../../helpers/dateFunctions';
import { ICardBaseConfig } from '../../indexCard';
import FullCardContainer from '../style/exportable_card/FullCardContainer';
import FullCardHeader from '../style/exportable_card/FullCardHeader';
import FullCardSource from '../style/exportable_card/FullCardSource';
import FullCardUnits from '../style/exportable_card/FullCardUnits';
import FullCardValue from '../style/exportable_card/FullCardValue';
import FullCardChart from './FullCardChart';
import FullCardLinks from './FullCardLinks';


interface IFullCardProps {
    serie: ISerie;
    downloadUrl: string;
    cardOptions: ICardBaseConfig
    laps: number;
}

export default (props: IFullCardProps) => {
    
    const options = {
        ...props.cardOptions,
        downloadUrl: props.downloadUrl,
        serieId: props.serie.id
    }
    const value = props.serie.data[props.serie.data.length-1].value
    const formatter = new CardValueFormatter(
        props.cardOptions.locale, props.serie.isPercentage, props.cardOptions.explicitSign)
        
    return (
        <FullCardContainer hasChart={props.cardOptions.hasChart}
                           hasFrame={props.cardOptions.hasFrame}
                           links={props.cardOptions.links}>
            <FullCardHeader color={props.cardOptions.color}
                            override={props.cardOptions.title}
                            defaultTitle={props.serie.description}
                            date={lastSerieDate(props.serie)} />
            <FullCardValue color={props.cardOptions.color} text={formatter.formattedValue(value)} />
            <FullCardChart data={shortDataList(props.serie.data, props.laps)} chartType={props.cardOptions.hasChart} />
            <FullCardUnits units={props.serie.representationModeUnits} override={props.cardOptions.units}/>
            <FullCardSource source={props.serie.datasetSource} override={props.cardOptions.source}/>
            <FullCardLinks options={options} />
        </FullCardContainer>
    )
}

function shortDataList(data: IDataPoint[], laps: number): IDataPoint[] {
    const result = data.slice(Math.max(data.length - laps, 0));

    return notNullData(result);
}

function notNullData(data: IDataPoint[]): IDataPoint[] {
    return data.filter((d: IDataPoint) => d.value !== null);
}

function lastSerieDate(serie: ISerie): string {
    return fullLocaleDate(serie.accrualPeriodicity, serie.data[serie.data.length-1].date);
}
