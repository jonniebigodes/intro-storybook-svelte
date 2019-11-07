import { storiesOf } from '@storybook/svelte';
import InboxScreen from './InboxScreen.svelte';

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