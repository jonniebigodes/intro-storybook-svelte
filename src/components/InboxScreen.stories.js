import InboxScreen from './InboxScreen.svelte';
//#region old format
/*import { storiesOf } from '@storybook/svelte';
 
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
}); */
//#endregion

//#region csf
export default {
    title:'PureInboxScreen',
}
export const standard=()=>({
    Component:InboxScreen,
})

export const error=()=>({
    Component:InboxScreen,
    props:{
        error:true
    }
})
//#endregion

