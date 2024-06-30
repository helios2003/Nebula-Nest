import Delete from './Delete';
import Status from './Status';
import { StatusProps } from './Status';

export default function Options({ projectId }: StatusProps) {
    return (
        <div className='flex space-x-8'>
            <Status projectId={projectId} />
            <Delete />
        </div>
    )
}