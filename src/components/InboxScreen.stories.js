import { storiesOf } from '@storybook/svelte';
import InboxScreen from './InboxScreen.svelte';

//#region old_format
storiesOf('PureInboxScreen',module)
.add('default',()=>{
    return{
        Component:InboxScreen,
    }
})
.add('error',()=>{
    return{
        Component:InboxScreen,
        props:{
            error:true
        }
    }
});
//#endregion
