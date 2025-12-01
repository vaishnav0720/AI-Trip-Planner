"use client"

import React, { useEffect, useState } from 'react'
import { Send, Loader } from 'lucide-react'
import axios from 'axios'
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import DurationUi from './DurationUi';
import ViewTripUi from './ViewTripUi';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import { useTripDetail } from '@/convex/TripDatailContext';

function Chatbox() {
  const { user } = useUser();
  const { setTripDtailId } = useTripDetail();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetails, setTripDetails] = useState();
  const SaveTripDetails = useMutation(api.tripdetails.saveTripDetails);
  const createUser = useMutation(api.user.createUser);
  const [tripDetailsId, setTripDetailsId] = useState();

  const existingUser = useQuery(
    api.user.getUserByEmail,
    user
      ? { email: user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '' }
      : undefined
  );
  const [userDatail, setUserDatail] = useState(null);

  const deriveUiType = (resp, ui) => {
    const raw = (ui || '').toString().toLowerCase();
    const content = (resp || '').toString().toLowerCase();
    const travelKeys = ['travelers', 'travellers', 'group', 'groupsize', 'group size'];
    const budgetKeys = ['budget', 'Budget'];
    const durationKeys = ['duration', 'days'];
    const finalKeys = ['final', 'view-trip', 'viewtrip', 'finalplan', 'plan'];
    if (travelKeys.includes(raw)) return 'travelers';
    if (budgetKeys.map(k => k.toLowerCase()).includes(raw)) return 'budget';
    if (durationKeys.includes(raw)) return 'duration';
    if (finalKeys.includes(raw)) return 'final';
    if (/(group|traveller|traveler|family|friends|couple|solo)/.test(content)) return 'travelers';
    if (/(budget|cheap|moderate|luxury|cost)/.test(content)) return 'budget';
    if (/(duration|day|days|how many days)/.test(content)) return 'duration';
    if (/(itinerary|trip plan|final itinerary|here is your itinerary|day 1)/.test(content)) return 'final';
    return null;
  };

  const onsend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setLoading(true);
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setUserInput('');

    try {
      const result = await axios.post('/api/aimodel', {
        messages: newMessages
      });

      console.log('API Response:', result.data);
      const aiResponse = result.data.resp || result.data.message || 'Sorry, I could not generate a response.';
      const uiType = deriveUiType(aiResponse, result.data.ui);

      if (uiType === 'final' && (result.data.trip_plan || result.data.tripDetails)) {
        const tp = result.data.trip_plan || {};
        const normalized = {
          origin: tp.origin || result.data.tripDetails?.origin || '',
          destination: tp.destination || result.data.tripDetails?.destination || '',
          budget: tp.budget || result.data.tripDetails?.budget || '',
          durationDays: parseInt(((tp.duration || result.data.tripDetails?.durationDays || '').toString().match(/\d+/) || [0])[0]),
          groupSize: tp.group_size || result.data.tripDetails?.groupSize || '',
          preferences: result.data.tripDetails?.preferences,
          hotels: Array.isArray(tp.hotels)
            ? tp.hotels.map((h) => ({
              name: h.hotel_name || h.name || '',
              description: h.description || h.hotelDetails || '',
              address: h.hotel_address || h.address || '',
              price: h.price_per_night || h.price || h.hotelPrice || ''
            }))
            : (result.data.tripDetails?.hotels || []),
          itinerary: tp.itinerary || result.data.tripDetails?.itinerary || []
        };
        setTripDetails(normalized);
        setTripDtailId(normalized);
        setTripDetailsId(result.data.trip_plan)
        try {
          await SaveTripDetails({
            userId: userDatail?._id,
            origin: normalized.origin,
            destination: normalized.destination,
            budget: normalized.budget,
            durationDays: Number.isFinite(normalized.durationDays) ? normalized.durationDays : 0,
            groupSize: normalized.groupSize,
            preferences: normalized.preferences,
            plan: JSON.stringify(result.data.trip_plan || result.data.tripDetails)
          });
        } catch (dbError) {
          console.error('Error saving trip details:', dbError);
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: aiResponse, ui: uiType }]);
    } catch (error) {
      const serverMsg = error?.response?.data?.resp || 'Sorry, there was an error processing your request. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: serverMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onsend();
    }
  };

  const handleOptionSelect = async (option, type = 'travelers') => {
    let response = '';
    if (type === 'travelers') {
      response = `${option.title} - ${option.people}`;
    } else if (type === 'budget') {
      response = option.title;
    } else if (type === 'duration') {
      response = `${option.days} days`;
    }

    const newMessages = [...messages, { role: 'user', content: response }];
    setLoading(true);
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const result = await axios.post('/api/aimodel', {
        messages: newMessages,
        isFinal: isFinal
      });

      const aiResponse = result.data.resp || result.data.message || 'Sorry, I could not generate a response.';
      const uiType = deriveUiType(aiResponse, result.data.ui);

      if (uiType === 'final' && (result.data.trip_plan || result.data.tripDetails)) {
        const tp = result.data.trip_plan || {};
        const normalized = {
          origin: tp.origin || result.data.tripDetails?.origin || '',
          destination: tp.destination || result.data.tripDetails?.destination || '',
          budget: tp.budget || result.data.tripDetails?.budget || '',
          durationDays: parseInt(((tp.duration || result.data.tripDetails?.durationDays || '').toString().match(/\d+/) || [0])[0]),
          groupSize: tp.group_size || result.data.tripDetails?.groupSize || '',
          preferences: result.data.tripDetails?.preferences,
        };
        setTripDetails(normalized);
      }

      !isFinal && setMessages([...newMessages, { role: 'assistant', content: aiResponse, ui: uiType }]);
    } catch (error) {
      const serverMsg = error?.response?.data?.resp || 'Sorry, there was an error processing your request. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: serverMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const RenderGenerativeUi = (uiType, content) => {
    if (!uiType) return null;

    switch (uiType) {
      case 'travelers':
      case 'group':
      case 'groupSize':
      case 'GroupSize':
      case 'travellers':
        return (
          <div className='mt-3'>
            <GroupSizeUi onSelect={(option) => handleOptionSelect(option, 'travelers')} />
          </div>
        );
      case 'budget':
      case 'Budget':
        return (
          <div className='mt-3'>
            <BudgetUi onSelect={(option) => handleOptionSelect(option, 'budget')} />
          </div>
        );
      case 'duration':
      case 'Duration':
      case 'days':
      case 'Days':
        return (
          <div className='mt-3'>
            <DurationUi onSelect={(option) => handleOptionSelect(option, 'duration')} />
          </div>
        );
      case 'final':
      case 'Final':
      case 'view-trip':
      case 'viewTrip':
        return (
          <ViewTripUi content={content}
            disabled={!tripDetails}
          />
        );
      default:
        return null;
    }
  };

  const canPreview = () => {
    return messages.length > 3;
  };

  const previewItinerary = async () => {
    const newMessages = [...messages, { role: 'user', content: 'Generate the complete itinerary now.' }];
    setPreviewLoading(true);
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    try {
      const result = await axios.post('/api/aimodel', { messages: newMessages, isFinal: true });
      const aiResponse = result.data.resp || result.data.message || 'Sorry, I could not generate a response.';
      const uiType = deriveUiType(aiResponse, result.data.ui || 'final');

      if (result.data.trip_plan || result.data.tripDetails) {
        const tp = result.data.trip_plan || {};
        const normalized = {
          origin: tp.origin || result.data.tripDetails?.origin || '',
          destination: tp.destination || result.data.tripDetails?.destination || '',
          budget: tp.budget || result.data.tripDetails?.budget || '',
          durationDays: parseInt(((tp.duration || result.data.tripDetails?.durationDays || '').toString().match(/\d+/) || [0])[0]),
          groupSize: tp.group_size || result.data.tripDetails?.groupSize || '',
          preferences: result.data.tripDetails?.preferences,
          hotels: Array.isArray(tp.hotels)
            ? tp.hotels.map((h) => ({
              name: h.hotel_name || h.name || '',
              description: h.description || h.hotelDetails || '',
              address: h.hotel_address || h.address || '',
              price: h.price_per_night || h.price || h.hotelPrice || ''
            }))
            : (result.data.tripDetails?.hotels || []),
          itinerary: tp.itinerary || result.data.tripDetails?.itinerary || []
        };
        setTripDetails(normalized);
        setTripDtailId(normalized);
        try {
          await SaveTripDetails({
            userId: userDatail?._id,
            origin: normalized.origin,
            destination: normalized.destination,
            budget: normalized.budget,
            durationDays: Number.isFinite(normalized.durationDays) ? normalized.durationDays : 0,
            groupSize: normalized.groupSize,
            preferences: normalized.preferences,
            plan: JSON.stringify(result.data.trip_plan || result.data.tripDetails)
          });
        } catch (dbError) {
          console.error('Error saving trip details:', dbError);
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: aiResponse, ui: uiType }]);
    } catch (error) {
      const serverMsg = error?.response?.data?.resp || 'Sorry, there was an error processing your request. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: serverMsg }]);
    } finally {
      setPreviewLoading(false);
    }

  };

  const finalProcessedRef = React.useRef(false);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !finalProcessedRef.current) {
      finalProcessedRef.current = true;
      setIsFinal(true);
    }
  }, [messages])

  useEffect(() => {
    if (!user) return;
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
    if (existingUser) {
      setUserDatail(existingUser);
      return;
    }
    if (email) {
      (async () => {
        const id = await createUser({
          username: user?.username || user?.fullName || user?.firstName || 'user',
          email
        });
        setUserDatail({ _id: id });
      })();
    }
  }, [user, existingUser, createUser])

  return (
    <div className='h-[75vh] flex flex-col'>
      {messages?.length == 0 &&
        <EmptyBoxState />
      }
      <section className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mt-4`}>
            <div className={`max-w-lg ${msg.role === 'user' ? 'bg-primary' : 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200'} text-black px-4 py-3 rounded-lg shadow-sm`}>
              <div className="text-xs font-semibold mb-1 text-gray-600">
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="text-sm">
                {loading && index === messages.length - 1 && msg.role === 'assistant' ? (
                  <Loader className='animate-spin w-5 h-5' />
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'assistant' && RenderGenerativeUi(msg.ui, msg.content)}
            </div>
          </div>
        ))}
      </section>

      {canPreview() && (
        <section className='px-4 pb-2'>
          <button
            onClick={previewItinerary}
            disabled={previewLoading}
            className='bg-linear-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all'
          >
            {previewLoading ? 'Generating...' : 'Preview Trip Plan'}
          </button>
        </section>
      )}

      <section className='border-t p-4'>
        <div className='flex gap-2 items-end'>
          <textarea
            placeholder='Ask me about your trip... (e.g., destinations, budget, activities)'
            rows={1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className='flex-1 border border-gray-300 rounded-lg px-2 py-6 focus:outline-none focus:ring-2 focus:ring-primary resize-none'
          />
          <button
            onClick={onsend}
            className='bg-linear-to-r from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center'>
            <Send size={20} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Chatbox
