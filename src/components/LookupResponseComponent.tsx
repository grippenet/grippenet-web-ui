import { CommonResponseComponentProps, getItemComponentByRole, getLocaleStringTextByCode, getStyleValueByKey, textsFromComponents} from './utils';
import React, { useEffect, useState, useRef } from 'react';
import { isItemGroupComponent, LocalizedObject, ResponseItem } from 'survey-engine/data_types';
import { Alert, Badge, Button, ListGroup } from 'react-bootstrap';

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

interface LookupListResponse {
    data: LookupEntry[]
}

interface LookupLabelResponse {
    label: string
}

interface LookupResponseComponentProps extends CommonResponseComponentProps {

}

const TextKeys = ['buttonLabel', 'updateButton',  'searchLabel' , 'responseLabel' , 'searchButton' , 'selectEntry' , 'loadingError' , 'minLengthError'] as const;

// 👇️Create union type from the readonly array of keys
type TextKeyType  = typeof TextKeys[number];

type TextUI = Record<TextKeyType, string>;

interface LookupFieldProps {
    lookupService: LookupService
    prefixKey: string
    minLength: number // Min search length before to accept to search
    maxLength: number;
    texts: TextUI
    responseSelected: (entry: LookupEntry ) => void
}

interface EntryListProps {
    list: LookupEntry[]
    texts: TextUI
    entrySelected: (entry: LookupEntry ) => void
}

const EntryList: React.FC<EntryListProps> = (props) => {

    const entrySelector= (entry: LookupEntry) => {
        return (
            <ListGroup.Item key={entry.code} onClick={ () => {
                props.entrySelected(entry);
            }} className="py-1 list-group-item-action">
            {entry.label}
            </ListGroup.Item>
        )
    }

    return (
        <div className='lookup-entry-comp'>
            { props.list.length > 0 ? <p>{props.texts.selectEntry}</p> : '' }
            <ListGroup className="py-1 lookup-entry-list">
                { props.list.map( (entry)=> { return entrySelector(entry)}) }
            </ListGroup>
        </div>
    );
};

class LookupService {

    url: string;

    /**
     * Label cache
     */
    cache: Map<string,string>;

    constructor(url:string) {
        this.url = url;
        this.cache = new Map();
    }

    /**
     * Get list of available codes for a given value
     * @param value 
     * @returns 
     */
    async search(value: string): Promise<LookupEntry[]> {
        const lookupUrl = this.url + '/query/' + value;
        const response = await fetch(lookupUrl)
        const data = await response.json() as LookupListResponse;
        return data.data;
    }

    /**
     * Get label for a given code
     * @param value 
     * @returns 
     */
    async label(value: string): Promise<string> {

        const v = this.cache.get(value);
        if(typeof(v) !== "undefined") {
            return v;
        }

        const lookupUrl = this.url + '/label/' + value;
        const response = await fetch(lookupUrl)
        const data = await response.json() as LookupLabelResponse;

        const label = data.label;

        this.cache.set(value, label);

        return label;
    }

}

// Url of the lookup service
export const lookupServices : Map<string, LookupService> = new Map();

export const registerLookupService = (name: string, url:string) => {
    lookupServices.set(name, new LookupService(url));
}

const LookupField: React.FC<LookupFieldProps> = (props) => {
 
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
        if(!value || value.length < props.minLength) {
            const e = props.texts.minLengthError.replace('{v}', ''+ props.minLength);
            setError(e);
            return;
        }
        setError('');
        setSearch(value);
        setSearching(true);
    };

    useEffect(() => {
        if(!searching) {
            return;
        }

        const fetchData = async() => {
            try {
                const data = await props.lookupService.search(search);
                setList(data);
            } catch(error) {
                console.log(`Error fetching ${error}`)
                setError(props.texts.loadingError);
                setSearching(false);
            } finally {
                setSearching(false);
            }
        }

        fetchData();    
    
    }, [searching]);

    const inputId = props.prefixKey + "-search";
    return (
        <div>
            <fieldset>
                <label htmlFor={inputId} className="me-1">{props.texts.searchLabel}</label>
                <input ref={inputRef} id={inputId} maxLength={props.maxLength} minLength={props.minLength}/>
                <Button onClick={SearchButtonHandler} size="sm" className='ms-1'>{props.texts.searchButton}</Button>
                { error ? <Alert variant='danger' className='mt-1 p-1'>{error}</Alert> : ''}
            </fieldset>
            { list.length ? 
                <EntryList list={list} entrySelected={EntryHandler} texts={props.texts}></EntryList>
            : undefined
            }
        </div>
    )

}

export const LookupResponseComponent : React.FC<LookupResponseComponentProps> = (props) => {

    var lookupName = 'unknown';

    const texts: TextUI = {
        searchLabel: "Enter your search and click on the search button",
        searchButton: "Search",
        selectEntry: "Select the entry in the list",
        loadingError: "An error occured during the data loading",
        responseLabel: "Your current response is",
        minLengthError: "Enter at least {v} characters",
        buttonLabel: 'Search',
        updateButton: 'Update'
    };

    const getIntStyle = (key: string, def: number): number => {
        const v = getStyleValueByKey(props.compDef.style, key);
        if(typeof(v) == "undefined") {
            return def;
        }
        const n = parseInt(v);
        if(isNaN(n)) {
            console.warn("Expected integer value for style '" + key + "', got '"+ v+ "'");
            return def;
        }
        return n;
    };

    const maxLength = getIntStyle("maxLength", 256);
    const minLength = getIntStyle("minLength", 256);
    
    const mainLabel = getLocaleStringTextByCode(props.compDef.content, props.languageCode);
    if(mainLabel) {
        texts.searchLabel = mainLabel;
    }

    if(isItemGroupComponent(props.compDef)) {
        textsFromComponents<TextKeyType>(props.compDef, TextKeys,  texts, props.languageCode);
        const cn = getItemComponentByRole(props.compDef.items, 'lookupName');
        if(cn && cn.key) {
            lookupName = cn.key;
        }
    }
    
    const lookupService = lookupServices.get(lookupName);

    if(!lookupService) {
        return <div>Unknown lookup service {lookupName}</div>;
    }

    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);
    const [show, setShow] = useState(true);
    const [label, setLabel] = useState<string>('');
    const [labelLoaded, setLabelLoaded] = useState<boolean>(false);

    const key =  props.compDef.key ?? 'lookup';

    const responseSelected = (entry: LookupEntry ) => {
        console.log('Entry selected', entry);
        setResponse({key: key, value: entry.code })
        updateLabel(entry.label);
        setTouched(true);
    };

    const updateLabel = (label:string)=> {
        setLabel(label);
        setShow(false);
    }

    
    useEffect(()=>{
        props.responseChanged(response);
    }, [response]);

    useEffect( ()=> {
        if(labelLoaded || touched) {
            return;
        }
        setLabelLoaded(true); // Only need to load once
        if(props.prefill && props.prefill.value) {
            const code = props.prefill.value;
            const fetchData = async () => {
                try {
                    const label = await lookupService.label(code);
                    updateLabel(label);
                } catch(e) {
                    console.log('error fetching label', e);
                }
            };
            fetchData();
        }
    }, [label, touched, labelLoaded]);

    return (
        <React.Fragment>
        { label ? <p>{texts.responseLabel}<Badge className='ms-1'>{label}</Badge><Button size="sm" variant='primary' className='ms-1' onClick={()=> setShow(true) }>{texts.updateButton}</Button></p>  : '' }
        { show ? <LookupField prefixKey='toto' minLength={minLength} maxLength={maxLength} texts={texts} responseSelected={responseSelected} lookupService={lookupService} /> : '' }
        </React.Fragment>
    );

}
