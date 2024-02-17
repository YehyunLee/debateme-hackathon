import React from 'react';

interface Props {
    data: [string, number][];
}

const debateLeaderboard: React.FC<Props> = ({ data }) => {
    return (
        <>
        <h1 className='text-1E635F text-center pt-[2rem] mb-[1rem] text-3xl font-bold' > Leaderboard </h1>
        <table className='text-center mr-auto ml-auto w-[50vw] table-fixed border border-seperate border-slate-500 text-xl rounded-xl '>
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