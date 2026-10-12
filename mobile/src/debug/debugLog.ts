import {Share} from 'react-native';
const entries:string[]=[];
export function debugLog(event:string,details:Record<string,unknown>={}):void{
 entries.push(JSON.stringify({timestamp:new Date().toISOString(),event,...details}));
 if(entries.length>500)entries.shift();
}
export async function exportDebugLog():Promise<void>{
 await Share.share({title:'Smart Bus debug log',message:entries.length?entries.join('\n'):'No debug events recorded.'});
}
