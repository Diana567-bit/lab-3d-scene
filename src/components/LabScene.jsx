import React from 'react'
import Room from './Room'
import LabBench from './LabBench'
import CeilingLight from './CeilingLight'
import LabStool from './LabStool'
import LabEquipment from './LabEquipment'
import CeilingVent from './CeilingVent'
import FumeHood from './FumeHood'
import MedicineCabinet from './MedicineCabinet'
import ChemicalBottle from './ChemicalBottle'
import LabTools from './LabTools'
import WorkbenchCabinet from './WorkbenchCabinet'
import OverheadLight from './OverheadLight'
import ReagentBottle from './ReagentBottle'

export default function LabScene({ lightsOn = true, setLightsOn, overheadLightsOn = true, setOverheadLightsOn, isDay = true, onReagentClick, reagentData = [] }) {
  
  return (
    <group>
      <Room 
        width={14} 
        length={18} 
        height={4} 
        lightsOn={lightsOn} 
        toggleLights={() => setLightsOn(!lightsOn)} 
        overheadLightsOn={overheadLightsOn}
        toggleOverheadLights={() => setOverheadLightsOn(!overheadLightsOn)}
        isDay={isDay}
      />
      

      {/* Center Island Benches Group 1 */}
      <group position={[-2, 0, -2]}>
        <LabBench position={[0, 0, 0]} type="island" />
        <OverheadLight position={[0, 3.95, 0]} isOn={overheadLightsOn} />
        {/* Stools in center knee space - Front and Back */}
        <LabStool position={[0, 0, -0.9]} />
        <LabStool position={[0, 0, 0.9]} />
        {/* Equipment on bench - Test Tube Rack Set and Glassware */}
        <LabEquipment position={[-0.6, 0.95, -0.2]} type="test-tube-rack-set" />
        <LabEquipment position={[0.6, 0.95, 0.2]} type="glassware-set" />
      </group>

      {/* Center Island Benches Group 2 */}
      <group position={[2, 0, -2]}>
        <LabBench position={[0, 0, 0]} type="island" />
        <OverheadLight position={[0, 3.95, 0]} isOn={overheadLightsOn} />
        <LabStool position={[0, 0, -0.9]} />
        <LabStool position={[0, 0, 0.9]} />
        {/* Equipment - Test Tube Rack Set and Glassware */}
        <LabEquipment position={[-0.6, 0.95, -0.2]} type="test-tube-rack-set" />
        <LabEquipment position={[0.6, 0.95, 0.2]} type="glassware-set" />
      </group>

       {/* Center Island Benches Group 3 (Front) */}
       <group position={[-2, 0, 2]}>
        <LabBench position={[0, 0, 0]} type="island" />
        <OverheadLight position={[0, 3.95, 0]} isOn={overheadLightsOn} />
        <LabStool position={[0, 0, -0.9]} />
        <LabStool position={[0, 0, 0.9]} />
        {/* Equipment - Test Tube Rack Set and Glassware */}
        <LabEquipment position={[-0.6, 0.95, -0.2]} type="test-tube-rack-set" />
        <LabEquipment position={[0.6, 0.95, 0.2]} type="glassware-set" />
      </group>

       {/* Center Island Benches Group 4 (Front) */}
       <group position={[2, 0, 2]}>
        <LabBench position={[0, 0, 0]} type="island" />
        <OverheadLight position={[0, 3.95, 0]} isOn={overheadLightsOn} />
        <LabStool position={[0, 0, -0.9]} />
        <LabStool position={[0, 0, 0.9]} />
        {/* Equipment - Test Tube Rack Set and Glassware */}
        <LabEquipment position={[-0.6, 0.95, -0.2]} type="test-tube-rack-set" />
        <LabEquipment position={[0.6, 0.95, 0.2]} type="glassware-set" />
      </group>


      {/* Side Benches (Right Wall) */}
      <group position={[6, 0, 0]}>
         <LabBench position={[0, 0, -5]} rotation={[0, -Math.PI/2, 0]} type="wall" />
         <LabBench position={[0, 0, -2]} rotation={[0, -Math.PI/2, 0]} type="wall" />
         <LabBench position={[0, 0, 1]} rotation={[0, -Math.PI/2, 0]} type="wall" />
         <LabBench position={[0, 0, 4]} rotation={[0, -Math.PI/2, 0]} type="wall" />
      </group>
      
      {/* Ceiling Vents */}
      <group position={[0, 3.95, 0]}>
        <CeilingVent position={[-6, 0, -6]} />
        <CeilingVent position={[6, 0, -6]} />
        <CeilingVent position={[-6, 0, 6]} />
        <CeilingVent position={[6, 0, 6]} />
      </group>

      {/* Fume Hoods - Back Wall */}
      <group position={[0, 0, -8.5]}>
         <FumeHood position={[-3, 0, 0]} />
         <FumeHood position={[0, 0, 0]} />
         <FumeHood position={[3, 0, 0]} />
      </group>

      {/* Fume Hoods - Front Wall */}
      <group position={[0, 0, 8.5]} rotation={[0, Math.PI, 0]}>
         {/* Large Modern Fume Hoods side-by-side, against Right Wall (Global X=7 -> Local X=-7) */}
         <FumeHood position={[-6.05, 0, 0]} type="modern" width={1.9} height={2.8} />
         <FumeHood position={[-4.1, 0, 0]} type="modern" width={1.9} height={2.8} />
         
         {/* Ventilation Ducts to Right Wall (Local X=-7) */}
         {/* Duct for Outer Hood (-6.05) */}
         <group>
            {/* Vertical section */}
            <mesh position={[-6.05, 3.15, 0]}>
               <cylinderGeometry args={[0.15, 0.15, 0.7]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
            {/* Elbow */}
            <mesh position={[-6.05, 3.5, 0]}>
               <sphereGeometry args={[0.15]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
            {/* Horizontal section to wall (-7.0) */}
            <mesh position={[-6.525, 3.5, 0]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.15, 0.15, 0.95]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
         </group>

         {/* Duct for Inner Hood (-4.1) */}
         <group>
            {/* Vertical section */}
            <mesh position={[-4.1, 3.15, 0]}>
               <cylinderGeometry args={[0.15, 0.15, 0.7]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
            {/* Elbow */}
            <mesh position={[-4.1, 3.5, 0]}>
               <sphereGeometry args={[0.15]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
            {/* Horizontal section to wall (-7.0) */}
            <mesh position={[-5.55, 3.5, 0]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.15, 0.15, 2.9]} />
               <meshStandardMaterial color="#eeeeee" roughness={0.3} />
            </mesh>
         </group>

         {/* Corrosive Medicine Cabinets - Left of Fume Hoods */}
         {/* Positions with gaps between cabinets */}
         {/* Cabinet UIDs: 腐蚀品柜1号 ~ 腐蚀品柜4号 */}
         {[-2.2, -0.7, 0.8, 2.3].map((cabX, i) => {
            const cabinetUid = `腐蚀品柜${i + 1}号`
            
            // 获取该柜子的所有试剂，按位置排序
            const cabinetReagents = reagentData
              .filter(r => r.cabinetUid === cabinetUid)
              .sort((a, b) => {
                const [aShelf, aPos] = a.position.split('-').map(Number)
                const [bShelf, bPos] = b.position.split('-').map(Number)
                return (aShelf - bShelf) || (aPos - bPos)
              })
            
            // 定义层和位置的坐标（第1层在最上面，从上到下排列）
            const shelfYPositions = [1.50, 1.14, 0.78, 0.42, 0.08] // 第1层最高，第5层最低
            const positionXOffsets = [-0.3, -0.1, 0.1, 0.3] // 从左到右排列
            
            return (
            <React.Fragment key={`corrosive-cab-${i}`}>
               <MedicineCabinet position={[cabX, 0.9, 0]} type="corrosive" />
               
               {/* 按顺序渲染试剂瓶 */}
               {cabinetReagents.map((reagent, idx) => {
                 const [shelf, pos] = reagent.position.split('-').map(Number)
                 const shelfY = shelfYPositions[shelf - 1] // 层数从1开始，数组从0开始
                 const posX = cabX + positionXOffsets[pos - 1] // 位置从1开始，数组从0开始
                 
                 return (
                   <ReagentBottle
                     key={`corrosive-bottle-${i}-${reagent.id}`}
                     position={[posX, shelfY, 0]}
                     type={idx % 2 === 0 ? 'brown' : 'clear'} // 交替类型
                     label={true}
                     reagentData={reagent}
                     onBottleClick={onReagentClick}
                     cabinetUid={cabinetUid}
                   />
                 )
               })}
            </React.Fragment>
         )})}

         {/* PP Safety Cabinets (45 Gallon) - Next to Corrosive Cabinets with gaps */}
         {/* Cabinet UIDs: PP安全柜1号 ~ PP安全柜3号 */}
         {[3.8, 5.1, 6.4].map((ppX, i) => {
            const cabinetUid = `PP安全柜${i + 1}号`
            
            // 获取该柜子的所有试剂，按位置排序
            const cabinetReagents = reagentData
              .filter(r => r.cabinetUid === cabinetUid)
              .sort((a, b) => {
                const [aShelf, aPos] = a.position.split('-').map(Number)
                const [bShelf, bPos] = b.position.split('-').map(Number)
                return (aShelf - bShelf) || (aPos - bPos)
              })
            
            // 定义层和位置的坐标（第1层在最上面，从上到下排列）
            const shelfYPositions = [1.39, 1.06, 0.73, 0.40, 0.08] // 第1层最高，第5层最低
            const positionXOffsets = [-0.35, -0.12, 0.12, 0.35] // 从左到右排列
            
            return (
            <React.Fragment key={`pp-cabinet-${i}`}>
               <MedicineCabinet position={[ppX, 0.75, 0]} type="pp" />
               
               {/* 按顺序渲染试剂瓶 */}
               {cabinetReagents.map((reagent, idx) => {
                 const [shelf, pos] = reagent.position.split('-').map(Number)
                 const shelfY = shelfYPositions[shelf - 1] // 层数从1开始，数组从0开始
                 const posX = ppX + positionXOffsets[pos - 1] // 位置从1开始，数组从0开始
                 
                 return (
                   <ReagentBottle
                     key={`pp-bottle-${i}-${reagent.id}`}
                     position={[posX, shelfY, 0]}
                     type={idx % 3 === 0 ? 'brown' : 'clear'} // 交替类型
                     label={true}
                     reagentData={reagent}
                     onBottleClick={onReagentClick}
                     cabinetUid={cabinetUid}
                   />
                 )
               })}
            </React.Fragment>
         )})}
      </group>

      {/* Medicine Cabinets - Left Wall - Regular Layout */}
      {/* Cabinet UIDs: 药品柜1号 ~ 药品柜4号 */}
      <group position={[-6.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
         {/* 4 cabinets evenly spaced along the wall */}
         {[-5.4, -2.4, 0.2, 2.8].map((cabinetZ, cabIndex) => {
           const cabinetUid = `药品柜${cabIndex + 1}号`
           
           // 获取该柜子的所有试剂，按位置排序
           const cabinetReagents = reagentData
             .filter(r => r.cabinetUid === cabinetUid)
             .sort((a, b) => {
               const [aShelf, aPos] = a.position.split('-').map(Number)
               const [bShelf, bPos] = b.position.split('-').map(Number)
               return (aShelf - bShelf) || (aPos - bPos)
             })
           
           // 定义层和位置的坐标（第1层在最上面，从上到下排列）
           const shelfYPositions = [1.55, 1.35, 1.15, 0.67, 0.47] // 第1层最高，第5层最低
           const positionXOffsets = [-0.3, -0.15, 0, 0.15, 0.3] // 从左到右排列
           
           return (
             <React.Fragment key={`cab-${cabIndex}`}>
               {/* Medicine Cabinet */}
               <MedicineCabinet position={[cabinetZ, 0.9, 0]} />
               
               {/* Shelves */}
               {[1.48, 1.28, 1.08, 0.6, 0.4].map((y, i) => (
                 <mesh key={`shelf-${cabIndex}-${i}`} position={[cabinetZ, y, 0]} castShadow receiveShadow>
                   <boxGeometry args={[0.85, 0.02, 0.35]} />
                   <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
                 </mesh>
               ))}

               {/* 按顺序渲染试剂瓶 */}
               {cabinetReagents.map((reagent, idx) => {
                 const [shelf, pos] = reagent.position.split('-').map(Number)
                 const shelfY = shelfYPositions[shelf - 1] // 层数从1开始，数组从0开始
                 const posX = cabinetZ + positionXOffsets[pos - 1] // 位置从1开始，数组从0开始
                 
                 return (
                   <ReagentBottle
                     key={`bottle-${cabIndex}-${reagent.id}`}
                     position={[posX, shelfY, 0]}
                     type={idx % 3 === 0 ? 'brown' : 'clear'} // 交替类型
                     label={true}
                     reagentData={reagent}
                     onBottleClick={onReagentClick}
                     cabinetUid={cabinetUid}
                   />
                 )
               })}
             </React.Fragment>
           )
         })}
      </group>
      
      {/* Lab Tools on benches */}
      <group position={[-2, 0.95, -2]}>
         <LabTools position={[0.9, 0, -0.4]} type="tweezers" />
         <LabTools position={[1.1, 0, -0.3]} type="spatula" />
      </group>
      
      <group position={[2, 0.95, -2]}>
         <LabTools position={[-0.9, 0, 0.3]} type="pipette" />
         <LabTools position={[-0.7, 0, 0.4]} type="scalpel" />
      </group>

    </group>
  )
}
