// type UserTuple = [string, number];

// const debateLeaderboard = (users: UserTuple[]): JSX.Element => {
//     // Mapping each tuple to a table row
//     const rows: React.JSX[] = users.map((user: UserTuple, index: number) => (
//         <tr key={index}>
//             <td>{user[0]}</td> {/* Username */}
//             <td>{user[1]}</td> {/* Integer value */}
//         </tr>
//     ));

//     // Returning the table structure
//     return (
//         <table>
//             <thead>
//                 <tr>
//                     <th>Username</th>
//                     <th>Score</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {rows} {/* Inserting the rows */}
//             </tbody>
//         </table>
//     );
// }

// export default debateLeaderboard;