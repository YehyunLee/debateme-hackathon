/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DebateLeaderboard: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await axios.get('https://web-production-a23d.up.railway.app/get_leaderboard');
                // Convert object values to an array
                const leaderboardArray = Object.values(response.data);
                setLeaderboardData(leaderboardArray);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <>
            <table className='text-center bg-white mr-auto ml-auto w-[40vw] table-fixed border border-separate border-slate-500 text-xl rounded-xl '>
                <thead>
                    <tr>
                        <th className='border-b-2 border-slate-500'>Rank</th>
                        <th className='border-b-2 border-slate-500'>Username</th>
                        <th className='border-b-2 border-slate-500'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.length > 0 && leaderboardData.map((user: any, index: number) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.elo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default DebateLeaderboard;
