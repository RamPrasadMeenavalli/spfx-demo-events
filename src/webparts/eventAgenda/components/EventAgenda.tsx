import * as React from 'react';
import styles from './EventAgenda.module.scss';
import { IEventAgendaProps } from './IEventAgendaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { Card } from '@uifabric/react-cards';
import { Text } from 'office-ui-fabric-react';

export interface IEventAgendaState {
  items:Array<any>;
}

export default class EventAgenda extends React.Component<IEventAgendaProps, IEventAgendaState> {
  constructor(props:IEventAgendaProps){
    super(props);
    this.state ={
      items:[]
    };
  }

  public render(): React.ReactElement<IEventAgendaProps> {
    const { items } = this.state;
    return (
      <div className={ styles.eventAgenda }>
          {items && items.map(item => 
            <Card horizontal className={styles.card}>
              <Card.Item fill>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Ic_event_48px.svg" />
              </Card.Item>
              <Card.Section>
                <Text variant="large" block>
                  {item.Title}
                </Text>
                <Text variant="medium" block>
                  {item.Description}
                </Text>
                <Text variant="medium" block>
                  {item["FieldValuesAsText"].StartDate} to {item["FieldValuesAsText"].EndDate}
                </Text>
              </Card.Section>
            </Card>
          )}
      </div>
    );
  }

  public async componentDidMount(){
    //Read the items from the events list
    const listName = "Events";
    
    let items = await sp.web.lists.getByTitle(listName)
    .items
    .select("Title","Description","StartDate","EndDate","FieldValuesAsText/StartDate","FieldValuesAsText/EndDate")
    .expand("FieldValuesAsText")
    .get();
    console.dir(items);

    this.setState({items});
  }
}
