import { CommonResponseComponentProps } from 'case-web-ui/build/components/survey/SurveySingleItemView/utils';
import React, { useEffect, useState, useRef } from 'react';
import { ResponseItem } from 'survey-engine/data_types';
import { Button, ListGroup } from 'react-bootstrap';

/**
 * Lookup service API
 * 
 * /query/code=> LookupResponse
 * /label/code=> 
 */

// Response Provided by the Lookup service
interface LookupEntry {
    code: string
    label: string
}

interface LookupServiceResponse {
    data: LookupEntry[]
}

interface LabelResponse {
    label: string
}

interface LookupResponseComponentProps extends CommonResponseComponentProps {

}

interface TextUI {
    searchLabel: string
    searchButton: string
    selectEntry: string
}

interface LookupFieldProps {
    lookupBaseUrl: string
    prefixKey: string
    minLength: number // Min search length before to accept to search
    texts: TextUI
    responseSelected: (entry: LookupEntry ) => void
}

interface EntryListProps {
    list: LookupEntry[]
    texts: TextUI
    entrySelected: (entry: LookupEntry ) => void
}

const EntryList: React.FC<EntryListProps> = (props) => {

    const listRef = useRef<HTMLElement>(null);

    const entrySelector= (entry: LookupEntry) => {
        return (
            <ListGroup.Item key={entry.code} onClick={ () => {
                props.entrySelected(entry);
            }} className="py-1">
            {entry.label}
            </ListGroup.Item>
        )
    }

    return (
        <div className='lookup-entry-comp'>
            <p>{props.texts.selectEntry}</p>
            <ListGroup className="py-1 lookup-entry-list">
                { props.list.map( (entry)=> { return entrySelector(entry)}) }
            </ListGroup>
        </div>
    );
};

interface LookupSearchProps {
    lookupUrl: string
}

const LookupField: React.FC<LookupFieldProps> = (props) => {

    const lookupUrl = props.lookupBaseUrl + '/query';
    
    const [searching, setSearching] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    
    const [list, setList] = useState<LookupEntry[]>([]);
    const [error, setError]= useState<string>('');

    const inputRef = useRef<HTMLInputElement>(null);

    const EntryHandler = (entry: LookupEntry)=> {
        props.responseSelected(entry);
    };

    const SearchButtonHandler = () => {
        const value = inputRef.current?.value;
        if(!value) {
            return;
        }
        if(value.length < props.minLength) {
            return
        }
        setSearch(value);
        setSearching(true);
    };

    useEffect(()=> {
        if(!searching) {
            return;
        }
        const fetchData = async () => {
            const response = await fetch(`${lookupUrl}/${search}`)
            const data = await response.json() as LookupServiceResponse;
            setList(data.data);
            setSearching(false);
        };
        
        fetchData().catch((reason:any)=> {
            console.log(`Error fetching ${reason}`)
            setError(error);
            setSearching(false);
        });
    
    }, [searching]);

    const inputId = props.prefixKey + "-search";
    return (
        <div>
            <label htmlFor={inputId}>{props.texts.searchLabel}</label>
            <input ref={inputRef} id={inputId}/>
            <Button onClick={SearchButtonHandler}>{props.texts.searchButton}</Button>
            { list ? 
            <EntryList list={list} entrySelected={EntryHandler} texts={props.texts}></EntryList>
            : undefined
            }
        </div>
    )

}

export const LookupResponseComponent : React.FC<LookupResponseComponentProps> = (props) => {

    const lookupBaseUrl = 'http://localhost:8081';

    const labelUrl = lookupBaseUrl + '/label';
    
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);
  
    const [label, setLabel] = useState<string>('');

    const texts = {
        searchLabel : "Indiquez votre code postal",
        searchButton: "Recherchez",
        selectEntry:"Sélectionnez votre commune dans la liste ci-dessous"
    };

    
    const key =  props.compDef.key ?? 'postalCode';

    const responseSelected = (entry: LookupEntry ) => {
        console.log('Entry selected', entry);
        setResponse({key: key, value: entry.code })
        setLabel(entry.label);
    };

    return (
        <React.Fragment>
        <LookupField prefixKey='toto' minLength={5} texts={texts} responseSelected={responseSelected} lookupBaseUrl={lookupBaseUrl} />
        { 
            label ? 
                <p className="label label-info">{label}</p>  : 
                <p>Entrez votre code postal</p> 
        }
        </React.Fragment>
    );

}
