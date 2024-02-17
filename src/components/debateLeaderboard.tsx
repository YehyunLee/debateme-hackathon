import React from 'react';

interface Props {
    data: [string, number][];
}

const debateLeaderboard: React.FC<Props> = ({ data }) => {
    return (
        <>
        <table className='text-center bg-white mr-auto ml-auto w-[40vw] table-fixed border border-seperate border-slate-500 text-xl rounded-xl '>
            <thead>
                <tr>
                    <th className='border-b-2 border-slate-500 '>Username</th>
                    <th className='border-b-2 border-slate-500'>Score</th>
                </tr>
            </thead>
            <tbody>
                {data.map(([username, score]: [string, number], index: number) => (
                    <tr key={index}>
                        <td >{username}</td>
                        <td>{score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );
}


export default debateLeaderboard;